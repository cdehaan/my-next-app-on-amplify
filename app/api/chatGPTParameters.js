export const systemContextString = `You will receive free-form text from a person. You must extract information about 4 topics: when the person slept, what they ate and when, when they went outside and why, and what exercise they did that day.

When the person explicitly says that they did not do an activity, return an empty array for that entry.
However, if they don't mention one or more of the activities, it should be set as "undefined".

Times should always be written as 24 hour times, such as 13:30 or 00:30
Durations should be written in hh:mm format. For example, 30 minutes is 00:30 and 8 hours is 08:00

Food descriptions should only contain details about the actual food. Phrases such as "another" or "a quick" or "for lunch" should be removed. Phrases like "a big" or "sugary" should be included.

If the person describes an activity that is both exercise and typically done outside, such as riding a bike, you should make 2 matching entries; one in "exercise" and also one in "outside" using the same times and description.
If it is unclear whether an activity qualifies as "exercise" or "outside", you should error on the side of including it in the returned data. It is better to include more data than needed rather than exlcude data that was needed.

Sleep quality should be based on any description the person uses to describe their sleep.
"terrible" sleep describes that sleep was not restful at all. For example, they were awake for hours, or couldn't fall asleep for an hour or more.
"poor" sleep would be, for example, if they mention that they woke up frequently, or didn't feel rested when they woke up.
"average" sleep might be, for example, if they woke up once or twice, but felt ok in the morning.
"good" sleep might be if the person indicates the sleep was fine or ok.
"great" sleep would be if the person indicates the sleep was great or very restful
If the person makes no indication of the quality of sleep, then the quality will be "undefined".

For each activity found, include the snipit of text that contained the description of the activity.
`;

export const chatFunctions = [{
  "name": "get_daily_activity",
  "description": "Extract a user's daily activity from free-form text.",
  "parameters": {
    "type": "object",
    "properties": {
      "sleep": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
              "start": {
                  "type": "string",
                  "description": "The start time of the sleep in 24h time, hh:mm, e.g., 22:00"
              },
              "end": {
                  "type": "string",
                  "description": "The end time of the sleep in 24h time, hh:mm, e.g., 7:00"
              },
              "duration": {
                  "type": "string",
                  "description": "The duration of sleep in the form hh:mm, e.g., 7:45"
              },
              "quality": {
                  "type": "string",
                  "enum": ["great", "good", "average", "poor", "terrible", "undefined"],
                  "description": "The quality of the sleep"
              },
              "snipit": {
                "type": "string",
                "description": "Text from the free-form text that described this sleep information."
              },
          },
          "required": ["start", "end", "quality", "snipit"]
        },
        "description": "Array of time slept during the day. Can be empty if user did not sleep."
      },
      "food": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "time": {
                    "type": "string",
                    "description": "The time the food was consumed in 24h time, hh:mm, e.g., 13:30"
                },
                "description": {
                    "type": "string",
                    "description": "Description of the food eaten"
                },
                "snipit": {
                  "type": "string",
                  "description": "Text from the free-form text that described this food information."
                },  
            },
            "required": ["time", "description", "snipit"]
        },
        "description": "Array of food items consumed during the day. Can be empty if no food was eaten."
      },
      "outside": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
              "start": {
                "type": "string",
                "description": "The start time of the time outside 24h time, hh:mm, e.g., 22:00"
              },
              "end": {
                  "type": "string",
                  "description": "The end time of the time outside in 24h time, hh:mm, e.g., 7:00"
              },
              "duration": {
                  "type": "string",
                  "description": "The duration of time outside in the form hh:mm, e.g., 7:45"
              },
              "description": {
                    "type": "string",
                    "description": "Description of the time outside"
              },
              "snipit": {
                "type": "string",
                "description": "Text from the free-form text that described this outside activity information."
              },  
            },
            "required": ["start", "end", "description", "snipit"]
        },
        "description": "Array of time spent outside during the day. Can be empty if no time was spent outside."
      },
      "exercise": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
              "start": {
                "type": "string",
                "description": "The start time of the exercise 24h time, hh:mm, e.g., 22:00"
              },
              "end": {
                  "type": "string",
                  "description": "The end time of the exercise in 24h time, hh:mm, e.g., 7:00"
              },
              "duration": {
                  "type": "string",
                  "description": "The duration of exercise in the form hh:mm, e.g., 7:45"
              },
              "description": {
                    "type": "string",
                    "description": "Description of the exercise"
              },
              "snipit": {
                "type": "string",
                "description": "Text from the free-form text that described this exercise information."
              },
            },
            "required": ["start", "end", "description", "snipit"]
        },
        "description": "Array of exercise done during the day. Can be empty if no exercise was done."
      },
    },
  },
}]

const exampleInput = `I slept well from midnight until about 7am. Then I ate some cereal for breakfast. After that, I went for a jog outside in the park at about 9am for an hour. At noon, I had a salad for lunch. An hour later, I sat outside for 30 minutes. I didn't do anything after that until 7pm when I had another salad.`
const exampleInputNoExercise = `I slept well from midnight until about 7am. Then I ate some cereal for breakfast. At noon, I had a salad for lunch. An hour later, I sat outside for 30 minutes. I didn't do anything after that until 7pm when I had another salad.`
const exampleOutput = {
  "sleep": [
    {
      "start": "00:00",
      "end": "07:00",
      "duration": "07:00",
      "quality": "good"
    }
  ],
  "food": [
    {
      "time": "07:00",
      "description": "cereal"
    },
    {
      "time": "12:00",
      "description": "salad"
    },
    {
      "time": "19:00",
      "description": "salad"
    }
  ],
  "outside": [
    {
      "start": "09:00",
      "end": "10:00",
      "duration": "01:00",
      "description": "run in the park"
    },
    {
      "start": "13:00",
      "end": "13:30",
      "duration": "00:30",
      "description": "sat outside"
    }
  ],
  "exercise": [
    {
      "start": "09:00",
      "end": "10:00",
      "duration": "01:00",
      "description": "run in the park"
    }
  ]
}