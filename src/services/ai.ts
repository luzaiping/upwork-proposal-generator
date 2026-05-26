const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

export async function generateProposal(params: {
  jobDescription: string
  skills: string
  tone: string
}) {
  const prompt = `
You are a senior freelance frontend developer.

Generate a high-quality Upwork proposal.

Requirements:
- Tone: ${params.tone}
- Skills: ${params.skills}

Job Description:
${params.jobDescription}

Output format:
- Professional proposal
- Clear structure
- No markdown symbols like ** or ###
- Natural human tone
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
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }

  const data = await res.json()

  console.log('[DEEPSEEK RAW RESPONSE]', data)

  return data.choices?.[0]?.message?.content ?? ""
}