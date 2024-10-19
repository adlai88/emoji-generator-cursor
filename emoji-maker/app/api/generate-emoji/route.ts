import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  try {
    // Step 1: Create prediction
    const prediction = await replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        width: 1024,
        height: 1024,
        prompt: "A TOK emoji of" + prompt,
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

    // Step 2: Get prediction result
    let result = await replicate.predictions.get(prediction.id);

    // Wait for the prediction to complete
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "succeeded") {
      return NextResponse.json({ urls: result.output });
    } else {
      throw new Error("Prediction failed");
    }
  } catch (error) {
    console.error('Error generating emoji:', error);
    return NextResponse.json({ error: 'Failed to generate emoji' }, { status: 500 });
  }
}
