import { useApp } from '../../store/AppContext';
import { Surface } from '../../theme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NakshatraFormModal() {
  const {
    isNewNakshatraOpen,
    setIsNewNakshatraOpen,
    newNakshatraName,
    setNewNakshatraName,
    handleCreateNakshatra,
  } = useApp();

  return (
    <Dialog open={isNewNakshatraOpen} onOpenChange={setIsNewNakshatraOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Birth Star (Nakshatra)</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateNakshatra} className="space-y-4 text-xs">
          <div>
            <Label className={`font-bold ${Surface.text[600]} mb-1`}>Nakshatra Name</Label>
            <Input
              required
              value={newNakshatraName}
              onChange={e => setNewNakshatraName(e.target.value)}
              placeholder="e.g. Rohini / ரோகிணி"
              className={Surface[50]}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewNakshatraOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
