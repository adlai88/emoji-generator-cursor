import { NextResponse } from 'next/server';
import Replicate from "replicate";
import { supabase, getUser } from '@/lib/clients';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const userId = await getUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = await req.json();

  try {
    // Step 1: Generate emoji using Replicate
    const prediction = await replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        width: 1024,
        height: 1024,
        prompt: "A TOK emoji of " + prompt,
        refine: "no_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: false,
        high_noise_frac: 0.8,
        negative_prompt: "",
        prompt_strength: 0.8,
        num_inference_steps: 50
      }
    });

    let result = await replicate.predictions.get(prediction.id);

    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status !== "succeeded" || !result.output || !result.output[0]) {
      throw new Error("Emoji generation failed");
    }

    const imageUrl = result.output[0];

    // Step 2: Download the generated image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Step 3: Upload to Supabase Storage
    const fileName = `emoji_${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('emojis')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png'
      });

    if (uploadError) {
      throw uploadError;
    }

    // Step 4: Get public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('emojis')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Step 5: Add entry to 'emojis' table
    const { data: emojiData, error: emojiError } = await supabase
      .from('emojis')
      .insert({
        image_url: publicUrl,
        prompt: prompt,
        creator_user_id: userId
      })
      .select()
      .single();

    if (emojiError) {
      throw emojiError;
    }

    return NextResponse.json({ emoji: emojiData });
  } catch (error) {
    console.error('Error generating and uploading emoji:', error);
    return NextResponse.json({ error: 'Failed to generate and upload emoji' }, { status: 500 });
  }
}

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes  