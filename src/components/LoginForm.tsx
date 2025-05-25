
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Lock, GraduationCap } from 'lucide-react';

const LoginForm = ({ onLogin }: { onLogin: (role: string) => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Временная логика аутентификации (будет заменена на Supabase)
    setTimeout(() => {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        toast({
          title: "Успешный вход!",
          description: "Добро пожаловать в админ панель.",
        });
        onLogin('admin');
      } else if (formData.username === 'moderator' && formData.password === 'mod123') {
        toast({
          title: "Успешный вход!",
          description: "Добро пожаловать, модератор.",
        });
        onLogin('moderator');
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный логин или пароль.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Админ панель
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Российский Государственный Социальный Университет
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="Введите логин"
                    className="pl-10"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти в систему'}
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Тестовые учетные записи:</p>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p><strong>Админ:</strong> admin / admin123</p>
                  <p><strong>Модератор:</strong> moderator / mod123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
