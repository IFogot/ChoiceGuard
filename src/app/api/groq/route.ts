import { NextRequest, NextResponse } from 'next/server';

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
  try {
    const body = await req.json();
    const { messages, apiKey: userKey, contextProduct } = body;

    const apiKey = userKey?.trim() || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'MISSING_API_KEY',
          message: 'กรุณาระบุ Groq API Key ในหน้าการตั้งค่า (Settings) หรือตั้งค่า GROQ_API_KEY ในระบบ เพื่อเริ่มสนทนากับน้องช้อยส์ AI',
        },
        { status: 401 }
      );
    }

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
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: 'GROQ_API_ERROR',
          message: errData.error?.message || `Groq API Error: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || 'ขออภัยค่ะ น้องช้อยส์ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
