import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const rowData = [
  { name: '노트북', category: '전자기기', price: 1200000, stock: 24 },
  { name: '마우스', category: '전자기기', price: 25000, stock: 130 },
  { name: '책상', category: '가구', price: 180000, stock: 15 },
  { name: '의자', category: '가구', price: 95000, stock: 40 },
  { name: '모니터', category: '전자기기', price: 320000, stock: 18 },
];

function SampleGrid() {
  const columnDefs = useMemo(
    () => [
      { field: 'name', headerName: '이름', sortable: true, filter: true },
      { field: 'category', headerName: '분류', sortable: true, filter: true },
      { field: 'price', headerName: '가격', sortable: true, filter: true },
      { field: 'stock', headerName: '재고', sortable: true, filter: true },
    ],
    []
  );

  return (
    <div style={{ height: 300, width: '100%' }}>
      <AgGridReact theme={themeQuartz} rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
}

export default SampleGrid;
