require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const apiEndpoint = "https://api.openai.com/v1/chat/completions";

// 공통 함수: ChatGPT API 호출
const callChatGPT = async (prompt, temperature = 0.3) => {
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that returns JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature,
    }),
  });

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    console.log(JSON.stringify(data, null, 2));
    throw new Error("OpenAI API 응답에 choices가 없습니다.");
  }
  const text = data.choices[0].message.content;

  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("JSON parsing error:", err, text);
    return null;
  }
};

// 1. 일기 문장 교정
const correctDiary = async (originalSentence) => {
  const prompt = `
    다음 문장을 현지에서 사용하는 영어 표현으로 교정하고, 이유와 유사 표현, 추가 예문을 JSON 형식으로 제공해줘. 교정 이유는 한국말로 작성해줘.
    원문: ${originalSentence}

    응답은 JSON 형식으로 줘:
    {
    "correctedSentence": "",
    "reason": "",
    "similarExpressions": [],
    "extraExamples": []
    }`;

  return await callChatGPT(prompt);
};

// 2. 코멘트 생성
const generateDiaryComment = async (diaryContent) => {
  const prompt = `
    다음 일기를 읽고 감정을 고려한 코멘트를 작성해줘.
    - 코멘트는 한 문단 정도로 간결하게
    - JSON 형식으로 반환
    일기:
    ${diaryContent}

    응답 형식:
    {
    "commentText": ""
    }`;

  return await callChatGPT(prompt);
};

// 3. 단어/숙어 생성
const generateVocabMeaning = async (vocab) => {
  const prompt = `
    아래의 영어 단어/숙어의 사전 속 원형, 뜻(영어), 예문 하나를 JSON 형식으로 반환해줘.
      
    단어/숙어:
    ${vocab}

    응답 형식:
    {
    "word": "",
    "meaning": "",
    "example": ""
    }`;

  return await callChatGPT(prompt);
};

module.exports = {
  correctDiary,
  generateDiaryComment,
  generateVocabMeaning,
};
