import { RecallNotice } from '../types';

export const RECALL_NOTICES: RecallNotice[] = [
  {
    id: 'RECALL-TFDA-2026-001',
    productId: 'prod_tuna_regular_1',
    productName: 'ทูน่าสเต็กในน้ำเกลือ บรรจุกระป๋อง ตรา ซีเวฟ สยาม',
    affectedLotCodes: ['LOT-2026-TNA-RECALL-01', 'LOT-2026-TNA-RECALL-02'],
    recallLevel: 'Class I', // อันตรายร้ายแรงต่อชีวิต/สุขภาพ (ตามประกาศ สธ. ฉบับที่ 420)
    hazardDescription: 'ตรวจพบการบกพร่องของกระบวนการฆ่าเชื้อด้วยความร้อน (Retort Under-processing) เสี่ยงต่อการเจริญเติบโตของสารพิษ Clostridium botulinum',
    hazardReason: 'microbial',
    publishedDate: '2026-10-18',
    authorizingAgency: 'สำนักงานคณะกรรมการอาหารและยา (อย.)',
    actionRequired: 'หยุดบริโภคทันที แยกกระป๋องออกจากบริเวณอาหาร ห้ามเปิดฝา และนำส่งคืนจุดจำหน่ายหรือแจ้งรับบริการกำจัดผ่านระบบ ChoiceGuard',
    resolutionRatePercent: 88, // 88% of registered pantry owners reached
    affectedConsumersCount: 3420,
  },
  {
    id: 'RECALL-TFDA-2026-002',
    productId: 'prod_noodle_regular_1',
    productName: 'บะหมี่กึ่งสำเร็จรูป รสต้มยำกุ้ง (สูตรดั้งเดิม) ล็อตส่งออกจำเพาะ',
    affectedLotCodes: ['LOT-2026-TYK-0941'],
    recallLevel: 'Class II', // ผลกระทบสุขภาพชั่วคราว
    hazardDescription: 'ตรวจพบสารตกค้างเอทิลีนออกไซด์ (Ethylene Oxide) ในพริกป่นเครื่องปรุง เกินเกณฑ์มาตรฐานความปลอดภัย',
    hazardReason: 'chemical',
    publishedDate: '2026-10-12',
    authorizingAgency: 'สำนักงานคณะกรรมการอาหารและยา (อย.)',
    actionRequired: 'หลีกเลี่ยงการบริโภคและนำสินค้ามาขอรับเงินคืนหรือเปลี่ยนสินค้าสูตรใหม่ที่จุดจำหน่าย',
    resolutionRatePercent: 94,
    affectedConsumersCount: 1850,
  }
];
