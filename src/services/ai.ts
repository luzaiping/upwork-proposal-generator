const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

export async function generateProposalStream(params: {
  jobDescription: string
  skills: string
  tone: string
  onDelta: (text: string) => void
  signal?: AbortSignal
}) {
  const prompt = `
You are a top 1% senior freelance frontend engineer on Upwork.

You consistently win high-paying contracts ($50-$100/hour).

Your proposals are known for being:
- concise
- highly relevant
- client-focused
- technically precise

---

STRICT OUTPUT RULES:
- Must use clean Markdown
- Must follow exact structure
- No filler sentences
- No generic introductions

---

PROPOSAL STRUCTURE:

# Proposal

## Understanding of Needs
- Restate client problem clearly

## Relevant Experience
- Match directly with: ${params.skills}

## Solution Approach
- Step-by-step implementation plan

## Value Proposition
- Why you are the best fit

## Closing
- Short call to action

---

TONE: ${params.tone}

JOB DESCRIPTION:
${params.jobDescription}
`

  const res = await fetch(
    "https://api.deepseek.com/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        stream: true,
      }),
      signal: params.signal,
    }
  )

  if (!res.body) return

  const reader = res.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let buffer = ""

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data:")) continue

        const jsonStr = trimmed.replace("data:", "").trim()
        if (jsonStr === "[DONE]") break

        try {
          const json = JSON.parse(jsonStr)
          const delta = json.choices?.[0]?.delta?.content

          if (delta) {
            params.onDelta(delta)
          }
        } catch {
          // ignore parse errors
        }
      }
    }
  } catch (err) {
    console.log("stream stopped:", err)
  }
}