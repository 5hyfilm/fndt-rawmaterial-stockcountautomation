// Path: ./src/hooks/inventory/index.ts
// ✅ FIXED: ลำดับการ export ที่ถูกต้องตาม dependency chain

// 1. ✅ Export types ก่อน (ไม่มี dependencies)
export * from "./types";

// 2. ✅ Export storage utilities (ขึ้นอยู่กับ types เท่านั้น)
export * from "./useInventoryStorage";

// 3. ✅ Export operations (ขึ้นอยู่กับ types + storage)
export * from "./useInventoryOperations";

// 4. ✅ Export summary utilities (ขึ้นอยู่กับ types)
export * from "./useInventorySummary";

// 5. ✅ Export export utilities (ขึ้นอยู่กับ types)
export * from "./useInventoryExport";

// 6. ✅ Export main manager ในที่สุด (ขึ้นอยู่กับทุกอย่างข้างต้น)
export * from "./useInventoryManager";
