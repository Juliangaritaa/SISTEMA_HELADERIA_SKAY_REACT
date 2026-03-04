import { Outlet } from 'react-router-dom';
import { AppNavbar } from '@/features/navbar/components/AppNavbar';

export function MainLayout() {
    return (
        <div className='min-h-screen bg-sky-50'>
            <AppNavbar />
            <main className='p-6'>
                <Outlet/>
            </main>
        </div>
    );
}