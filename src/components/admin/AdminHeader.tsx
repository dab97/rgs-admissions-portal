
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from './ThemeToggle';
import { Bell, Download, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminHeaderProps {
  title: string;
  description: string;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: 'Администратор',
    email: 'admin@university.ru',
    phone: '',
    avatar_url: ''
  });

  return (
    <>
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
            <Button className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Отчет
            </Button>
            <ThemeToggle />
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            {/* Профиль пользователя */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileData.avatar_url} alt="Профиль" />
                    <AvatarFallback>А</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profileData.full_name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {profileData.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Настройки</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Диалог профиля */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.avatar_url} />
                <AvatarFallback className="text-lg">А</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">URL аватара</Label>
              <Input
                id="avatar"
                value={profileData.avatar_url}
                onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
              />
            </div>
            <Button className="w-full">
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminHeader;
