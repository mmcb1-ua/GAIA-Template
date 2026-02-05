import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CreateNewsPage } from '../../features/news-management/pages/CreateNewsPage';
import { EditNewsPage } from '../../features/news-management/pages/EditNewsPage';
import { NewsAdminPage } from '../../features/news-management/pages/NewsAdminPage';
import { NewsFeedPage } from '../../features/news-management/pages/NewsFeedPage';
import { NewsDetailPage } from '../../features/news-management/pages/NewsDetailPage';

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
            {
                path: 'edit/:id',
                element: <EditNewsPage />,
            },
        ],
    },
    {
        path: '/news',
        children: [
            {
                index: true,
                element: <NewsFeedPage />,
            },
            {
                path: ':id',
                element: <NewsDetailPage />,
            },
        ],
    },
]);
