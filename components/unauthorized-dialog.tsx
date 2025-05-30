import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    title: string,
    description: string,
    buttons?: {
        onClick: () => void,
        text: string,
        variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    }[],
}

const UnauthorizedDialog = ({ open, setOpen, buttons, description, title}: Props) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">{title}</DialogTitle>
                    <DialogDescription className="mb-8">
                        {description}
                    </DialogDescription>
                    {buttons && (
                        <div className={`grid grid-cols-${buttons.length} gap-4`}>
                            {buttons.map((button) => (
                                <Button key={button.text} variant={button.variant} className="flex-1" onClick={button.onClick}>
                                    {button.text}
                                </Button>
                            ))}
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
 
export default UnauthorizedDialog;