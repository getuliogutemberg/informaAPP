
import DashboardPBI from "../components/DashboardPBI.tsx";

interface DashPBIProps {
  pageId: string | null;
}

export default function DashPBI({ pageId }: DashPBIProps ) {
  
  return <div style={{
     border:'none',
     width:'100vw',
     height:'100vh',
    //  overflow:'hidden',
    //  display:'flex',
    //  justifyContent:'center',
     background:'#101C44',
  }}>
  <DashboardPBI pageId={pageId} />
  </div>
  
}