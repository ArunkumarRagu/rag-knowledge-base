import { HfInference } from '@huggingface/inference';

const hf = new HfInference(); // no token needed for local / free models

export async function generateAnswer(
  question: string,
  context: string,
) {
  const prompt = `
You are a helpful assistant.

Answer the question ONLY using the context below.
If the answer is not in the context, say:
"I don't know based on the provided documents."

Context:
${context}

Question:
${question}

Answer:
`;

  const response = await hf.textGeneration({
    model: 'google/flan-t5-base',
    inputs: prompt,
    parameters: {
      max_new_tokens: 200,
      temperature: 0,
    },
  });

  return response.generated_text;
}