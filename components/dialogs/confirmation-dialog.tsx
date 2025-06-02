import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onRemoveLogo: () => void;
    onClose: () => void
}

const ConfirmationDialog = ({open, setOpen, onRemoveLogo, onClose}: Props) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    logo and remove it from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <Button onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button variant="destructive" onClick={onRemoveLogo}> Continue</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
 
export default ConfirmationDialog;