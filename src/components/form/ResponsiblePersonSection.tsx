
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search } from 'lucide-react';
import { ResponsiblePerson } from '@/constants';

interface ResponsiblePersonSectionProps {
  selectedResponsibleId: string;
  responsiblePersons: ResponsiblePerson[];
  onResponsibleChange: (id: string) => void;
}

const ResponsiblePersonSection = ({ 
  selectedResponsibleId, 
  responsiblePersons, 
  onResponsibleChange 
}: ResponsiblePersonSectionProps) => {
  const [responsibleOpen, setResponsibleOpen] = useState(false);
  const selectedResponsible = responsiblePersons.find(person => person.id === selectedResponsibleId);

  return (
    <div className="space-y-2">
      <Label htmlFor="responsible">Ответственный *</Label>
      <Popover open={responsibleOpen} onOpenChange={setResponsibleOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={responsibleOpen}
            className="w-full justify-between"
          >
            {selectedResponsible ? selectedResponsible.name : "Выберите ответственного..."}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Поиск ответственного..." />
            <CommandList>
              <CommandEmpty>Ответственный не найден.</CommandEmpty>
              <CommandGroup>
                {responsiblePersons.map((person) => (
                  <CommandItem
                    key={person.id}
                    value={person.name}
                    onSelect={() => {
                      onResponsibleChange(person.id);
                      setResponsibleOpen(false);
                    }}
                  >
                    {person.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ResponsiblePersonSection;
