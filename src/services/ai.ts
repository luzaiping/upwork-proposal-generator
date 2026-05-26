const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

export async function generateProposalStream(params: {
  jobDescription: string
  skills: string
  tone: string
  onDelta: (text: string) => void
}) {
  const prompt = `
  You are a senior freelance frontend engineer specializing in React, TypeScript, and modern SaaS applications.
  
  Your task is to write a high-quality Upwork proposal that helps the freelancer win the job.
  
  ---
  
  ## STRICT OUTPUT FORMAT (IMPORTANT)
  
  You MUST output in clean Markdown format:
  
  # Proposal Title
  
  ## 1. Introduction
  - Brief self-introduction
  - Acknowledge client's needs
  
  ## 2. Understanding of the Project
  - Summarize client requirements in your own words
  - Show understanding of business/problem
  
  ## 3. Relevant Experience
  - List relevant skills and experience
  - Focus on: ${params.skills}
  
  ## 4. Proposed Approach
  - Explain how you would solve the problem step by step
  - Be concrete and practical
  
  ## 5. Why Me
  - Highlight advantages (React, TypeScript, frontend architecture, etc.)
  
  ## 6. Closing
  - Short, polite call to action
  
  ---
  
  ## STYLE REQUIREMENTS
  
  - Tone: ${params.tone}
  - Professional, concise, and confident
  - Do NOT be overly verbose
  - Use bullet points where appropriate
  - Avoid generic filler phrases
  - Make it sound like a real experienced freelancer wrote it
  
  ---
  
  ## JOB DESCRIPTION
  
  ${params.jobDescription}
  `

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      stream: true,
    }),
  })

  if (!res.ok || !res.body) {
    const err = await res.text()
    console.error("❌ API Error Response:", err);
    throw new Error(err)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let buffer = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }

    const decoded = decoder.decode(value, { stream: true })
    
    buffer += decoded
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine.startsWith("data:")) continue
      
      const jsonStr = trimmedLine.replace("data:", "").trim()
      if (jsonStr === "[DONE]") {
        continue
      }

      try {
        const json = JSON.parse(jsonStr)
        const delta = json.choices?.[0]?.delta?.content
        
        if (delta) {
          params.onDelta(delta)
        } else if (json.choices?.[0]?.delta) {
          console.log("⚠️ Received delta without content:", json.choices[0].delta);
        }
      } catch (e) {
        console.warn("⚠️ JSON parse error for line:", trimmedLine.substring(0, 200), e);
      }
    }
  }
}