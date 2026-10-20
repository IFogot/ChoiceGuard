import { NextRequest, NextResponse } from 'next/server';

import { parseGroqChatRequest } from '@/lib/groq-request';

const SYSTEM_PROMPT = `คุณคือ "น้องช้อยส์ (Nong Choice)" ผู้ช่วยอัจฉริยะด้านอาหารและโภชนาการส่วนบุคคลประจำแพลตฟอร์ม ChoiceGuard (ช้อยส์การ์ด) สำหรับการแข่งขัน WELLNEXT Future Pitching (สำนักงานคณะกรรมการอาหารและยา กระทรวงสาธารณสุข)

หน้าที่ของคุณ:
1. ให้ความรู้ด้านโภชนาการ อ่านฉลากอาหาร วิเคราะห์ปริมาณโซเดียม น้ำตาล และไขมันอิ่มตัว
2. อ้างอิงเกณฑ์ "ตราสัญลักษณ์ทางเลือกสุขภาพ (Healthier Choice)" ของ อย. ประเทศไทย ที่รับรองผลิตภัณฑ์แล้วกว่า 3,245 รายการ
3. เชื่อมโยงปัญหา NCDs ในประเทศไทย: คนไทยกินโซเดียมเฉลี่ย 3,636 มก./วัน (เกือบ 2 เท่าของเกณฑ์ WHO 2,000 มก.), การเสียชีวิตจาก NCDs กว่า 400,000 ราย/ปี คิดเป็น 77% ของการเสียชีวิตทั้งหมด
4. แนะนำเทคนิคที่ปฏิบัติได้จริง เช่น การนับคาร์โบไฮเดรต (Carbohydrate counting), การไม่ซดน้ำซุปบะหมี่จนหมดเพื่อลดโซเดียมลง 40-50%, และการสลับไปใช้สินค้าตราทางเลือกสุขภาพ (Smart Swap)
5. สรุปประกาศเรียกคืนอาหาร (Food Recall) ตามประกาศกระทรวงสาธารณสุข ฉบับที่ 420 และเกณฑ์ FSMA 204 เป็นภาษาง่ายๆ พร้อมวิธีทิ้งหรือส่งคืนสินค้าอย่างปลอดภัย

ข้อจำกัดด้านความปลอดภัยและกฎหมาย (Strict Guardrails):
- คุณไม่ใช่แพทย์ และจะไม่ทำการวินิจฉัยโรคหรือสั่งจ่ายยาเด็ดขาด
- ให้คำแนะนำเชิงการปรับพฤติกรรมและการเลือกอาหารเท่านั้น หากผู้ใช้มีอาการผิดปกติรุนแรง ให้แนะนำพบแพทย์ทันที
- สุภาพ เป็นกันเอง อบอุ่น และใช้ภาษาไทยที่กระชับ เข้าใจง่าย`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI_UNAVAILABLE', message: 'AI assistance is not configured yet.' },
      { status: 503 }
    );
  }

  let request;
  try {
    request = parseGroqChatRequest(await req.json());
  } catch {
    return NextResponse.json(
      { error: 'INVALID_AI_REQUEST', message: 'Unable to process this AI request.' },
      { status: 400 }
    );
  }

  try {
    const { messages, contextProduct } = request;

    const systemWithContext = contextProduct
      ? `${SYSTEM_PROMPT}\n\n[ข้อมูลสินค้าที่ผู้ใช้กำลังดูอยู่]:\n- ชื่อ: ${contextProduct.name}\n- หมวด: ${contextProduct.categoryLabel}\n- โซเดียม: ${contextProduct.nutrition?.sodiumMg} มก.\n- น้ำตาล: ${contextProduct.nutrition?.sugarG} กรัม\n- ไขมันอิ่มตัว: ${contextProduct.nutrition?.saturatedFatG} กรัม\n- ตราทางเลือกสุขภาพ: ${contextProduct.healthierChoiceCertified ? 'มี' : 'ไม่มี'}\n- Lot Code: ${contextProduct.traceabilityLotCode}`
      : SYSTEM_PROMPT;

    const formattedMessages = [
      { role: 'system', content: systemWithContext },
      ...messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'ChoiceGuard-HealthPlatform/1.0',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || process.env.NEXT_PUBLIC_GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'GROQ_API_ERROR',
          message: 'AI assistance is temporarily unavailable. Please try again shortly.',
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const replyText = data.choices?.[0]?.message?.content?.trim();
    if (!replyText) {
      return NextResponse.json(
        { error: 'GROQ_API_ERROR', message: 'AI assistance returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Groq proxy failed:', error instanceof Error ? error.name : 'unknown-error');
    return NextResponse.json(
      { error: 'GROQ_API_ERROR', message: 'AI assistance is temporarily unavailable. Please try again shortly.' },
      { status: 502 }
    );
  }
}
