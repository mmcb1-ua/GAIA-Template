import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CreateNewsPage } from '../../features/news-management/pages/CreateNewsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/admin/news/create" replace />,
    },
    {
        path: '/admin/news',
        children: [
            {
                path: 'create',
                element: <CreateNewsPage />,
            },
            // Other routes will be added in future tickets
        ],
    },
]);
