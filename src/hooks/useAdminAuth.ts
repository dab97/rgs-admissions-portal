
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { APP_CONSTANTS } from '@/constants';

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Получаем пользователя из базы данных
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('id, username, role')
        .eq('username', username)
        .single();

      if (error || !adminUser) {
        toast({
          title: APP_CONSTANTS.MESSAGES.ERROR.LOGIN_FAILED,
          description: APP_CONSTANTS.MESSAGES.ERROR.LOGIN_FAILED_DESC,
          variant: "destructive",
        });
        return { success: false };
      }

      // В реальном приложении здесь должна быть проверка пароля
      // Для демонстрации используем простую проверку
      const validCredentials = 
        (username === 'admin' && password === 'admin123') ||
        (username === 'moderator' && password === 'mod123');

      if (!validCredentials) {
        toast({
          title: APP_CONSTANTS.MESSAGES.ERROR.LOGIN_FAILED,
          description: APP_CONSTANTS.MESSAGES.ERROR.LOGIN_FAILED_DESC,
          variant: "destructive",
        });
        return { success: false };
      }

      const successMessage = adminUser.role === APP_CONSTANTS.USER_ROLES.ADMIN 
        ? APP_CONSTANTS.MESSAGES.SUCCESS.LOGIN_SUCCESS_ADMIN
        : APP_CONSTANTS.MESSAGES.SUCCESS.LOGIN_SUCCESS_MODERATOR;

      toast({
        title: APP_CONSTANTS.MESSAGES.SUCCESS.LOGIN_SUCCESS,
        description: successMessage,
      });

      return { success: true, user: adminUser };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: APP_CONSTANTS.MESSAGES.ERROR.LOGIN_FAILED,
        description: 'Произошла ошибка при входе в систему.',
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading
  };
};
