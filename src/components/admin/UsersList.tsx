
import React, { useState } from 'react';
import { useUsers, User } from '@/hooks/useUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Plus, UserPlus } from 'lucide-react';

const UsersList = () => {
  const { users, loading, createUser, updateProfile } = useUsers();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    role: 'moderator',
    full_name: '',
    email: '',
  });

  const handleCreateUser = async () => {
    await createUser(newUser);
    setIsCreateDialogOpen(false);
    setNewUser({ username: '', role: 'moderator', full_name: '', email: '' });
  };

  const handleEditProfile = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editingUser?.profile) return;

    await updateProfile(editingUser.id, {
      full_name: editingUser.profile.full_name || '',
      email: editingUser.profile.email || '',
      phone: editingUser.profile.phone || '',
      avatar_url: editingUser.profile.avatar_url || '',
    });

    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700">Администратор</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-700">Модератор</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Пользователи</CardTitle>
          <CardDescription>Загрузка...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Пользователи системы</CardTitle>
            <CardDescription>
              Управление администраторами и модераторами
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Добавить пользователя
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать пользователя</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="username">Логин</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Роль</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderator">Модератор</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="full_name">ФИО</Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Создать
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Логин</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.profile?.full_name?.split(' ').map(n => n[0]).join('') || user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.profile?.full_name || user.username}
                        </div>
                        {user.profile?.phone && (
                          <div className="text-sm text-gray-500">{user.profile.phone}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.profile?.email || 'Не указан'}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProfile(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Диалог редактирования профиля */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={editingUser.profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {editingUser.profile?.full_name?.split(' ').map(n => n[0]).join('') || editingUser.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{editingUser.username}</div>
                  <div className="text-sm text-gray-500">{getRoleBadge(editingUser.role)}</div>
                </div>
              </div>
              <div>
                <Label htmlFor="edit_full_name">ФИО</Label>
                <Input
                  id="edit_full_name"
                  value={editingUser.profile?.full_name || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    profile: {
                      ...editingUser.profile!,
                      full_name: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={editingUser.profile?.email || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    profile: {
                      ...editingUser.profile!,
                      email: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit_phone">Телефон</Label>
                <Input
                  id="edit_phone"
                  value={editingUser.profile?.phone || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    profile: {
                      ...editingUser.profile!,
                      phone: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit_avatar">URL аватара</Label>
                <Input
                  id="edit_avatar"
                  value={editingUser.profile?.avatar_url || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    profile: {
                      ...editingUser.profile!,
                      avatar_url: e.target.value
                    }
                  })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSaveProfile}>
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersList;
