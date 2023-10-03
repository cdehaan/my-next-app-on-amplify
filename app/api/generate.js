import { Configuration, OpenAIApi } from "openai";
import { chatFunctions, systemContextString } from "./chatGPTParameters";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const dayDescription = req.body.dayDescription || '';
  if (dayDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid day description",
      }
    });
    return;
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    functions: chatFunctions,
    messages: [
      {"role": "system", "content": systemContextString},
      {"role": "user", "content": dayDescription},
    ]
  });

  console.log(completion.data.choices[0]);
  const reply = completion.data.choices[0].message.content ? {type: "message", message: completion.data.choices[0].message.content} : {type: "object", content: completion.data.choices[0].message.function_call.arguments}
  res.status(200).json(reply);
}