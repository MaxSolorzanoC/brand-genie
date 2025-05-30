import Navbar from "@/components/navbar";

const Dashboard = ({children}: {children: React.ReactNode}) => {
    
    return (
        <div className="bg-secondary h-screen w-screen overflow-hidden">
            <Navbar />
            <div className="flex flex-row h-full">
                {children}
            </div>
        </div>
    );
}
 
export default Dashboard;