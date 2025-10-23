import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"     
          className="text-white hover:text-yellow-400 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-yellow-400" 
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left"
        className="w-[280px] sm:w-[350px] px-0 py-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col"
      >
        

        <SheetHeader className="px-6 pt-6 pb-4 border-b dark:border-gray-800 flex flex-row items-center justify-between">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <Logo /> 
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <NavMenu 
            orientation="vertical" 
            className="flex flex-col gap-4 text-lg font-medium [&>a]:py-2" 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};