
import { useLocation } from 'react-router-dom';
import ApplicantsList from '@/components/admin/ApplicantsList';
import UsersList from '@/components/admin/UsersList';
import ChartsSection from '@/components/admin/ChartsSection';
import StatisticsCards from '@/components/admin/StatisticsCards';
import DashboardOverview from '@/components/admin/DashboardOverview';
import EmptyState from '@/components/admin/EmptyState';

interface PageContent {
  title: string;
  description: string;
  content: React.ReactNode;
}

export const usePageContent = (): PageContent => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/admin/applicants') {
    return {
      title: 'Поступающие',
      description: 'Управление заявками абитуриентов',
      content: ApplicantsList()
    };
  }

  if (path === '/admin/users') {
    return {
      title: 'Пользователи',
      description: 'Управление администраторами и модераторами',
      content: UsersList()
    };
  }

  if (path.startsWith('/admin/analytics')) {
    return {
      title: 'Аналитика',
      description: 'Детальный анализ данных поступающих',
      content: ChartsSection()
    };
  }

  if (path === '/admin/statistics') {
    return {
      title: 'Статистика',
      description: 'Общая статистика системы',
      content: StatisticsCards()
    };
  }

  if (path === '/admin/reports') {
    return {
      title: 'Отчеты',
      description: 'Создание и экспорт отчетов',
      content: EmptyState({
        title: 'Генерация отчетов',
        description: 'Создание детальных отчетов по различным критериям',
        message: 'Функция генерации отчетов будет добавлена в следующих обновлениях'
      })
    };
  }

  if (path === '/admin/settings') {
    return {
      title: 'Настройки',
      description: 'Конфигурация системы',
      content: EmptyState({
        title: 'Настройки системы',
        description: 'Общие настройки и конфигурация',
        message: 'Раздел настроек будет добавлен в следующих обновлениях'
      })
    };
  }

  // Default dashboard content
  return {
    title: 'Панель управления',
    description: 'Статистика и аналитика поступающих абитуриентов',
    content: DashboardOverview()
  };
};
