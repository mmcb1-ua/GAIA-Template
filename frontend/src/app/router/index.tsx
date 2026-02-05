import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CreateNewsPage } from '../../features/news-management/pages/CreateNewsPage';
import { NewsAdminPage } from '../../features/news-management/pages/NewsAdminPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/admin/news" replace />,
    },
    {
        path: '/admin/news',
        children: [
            {
                index: true,
                element: <NewsAdminPage />,
            },
            {
                path: 'create',
                element: <CreateNewsPage />,
            },
            // Other routes will be added in future tickets
        ],
    },
]);
