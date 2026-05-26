const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

export async function generateProposalStream(params: {
  jobDescription: string
  skills: string
  tone: string
  onDelta: (text: string) => void
}) {
  const prompt = `
You are a senior freelance frontend developer.

Generate a high-quality Upwork proposal.

Requirements:
- Tone: ${params.tone}
- Skills: ${params.skills}

Job Description:
${params.jobDescription}

Output:
A professional Upwork proposal.
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