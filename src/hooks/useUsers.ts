
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  role: string;
  created_at: string;
  profile?: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          *,
          user_profiles (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = data?.map(user => ({
        ...user,
        profile: user.user_profiles?.[0] || null
      })) || [];

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    username: string;
    role: string;
    full_name?: string;
    email?: string;
  }) => {
    try {
      const { data: newUser, error: userError } = await supabase
        .from('admin_users')
        .insert({
          username: userData.username,
          role: userData.role,
          password_hash: 'default_hash' // В реальном приложении здесь должен быть хеш пароля
        })
        .select()
        .single();

      if (userError) throw userError;

      if (userData.full_name || userData.email) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: newUser.id,
            full_name: userData.full_name,
            email: userData.email
          });

        if (profileError) throw profileError;
      }

      toast({
        title: 'Пользователь создан',
        description: `Пользователь ${userData.username} успешно создан`,
      });

      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать пользователя',
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (userId: string, profileData: {
    full_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData
        });

      if (error) throw error;

      toast({
        title: 'Профиль обновлен',
        description: 'Данные профиля успешно обновлены',
      });

      fetchUsers();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateProfile,
    refetch: fetchUsers
  };
};
