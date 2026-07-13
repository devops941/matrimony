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

export default function CommunityFormModal() {
  const {
    isNewCommunityOpen,
    setIsNewCommunityOpen,
    newCommName,
    setNewCommName,
    newCommRegion,
    setNewCommRegion,
    newCommCode,
    setNewCommCode,
    handleCreateCommunity,
  } = useApp();

  return (
    <Dialog open={isNewCommunityOpen} onOpenChange={setIsNewCommunityOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Astrological Community</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateCommunity} className="space-y-4 text-xs">
          <div>
            <Label className={`font-bold ${Surface.text[600]} mb-1`}>Community Name</Label>
            <Input
              required
              value={newCommName}
              onChange={e => setNewCommName(e.target.value)}
              placeholder="e.g. Kongu Vellalar"
              className={Surface[50]}
            />
          </div>

          <div>
            <Label className={`font-bold ${Surface.text[600]} mb-1`}>System Prefix Code</Label>
            <Input
              required
              maxLength={4}
              value={newCommCode}
              onChange={e => setNewCommCode(e.target.value)}
              placeholder="e.g. KVKN"
              className={`${Surface[50]} font-mono`}
            />
          </div>

          <div>
            <Label className={`font-bold ${Surface.text[600]} mb-1`}>Associated Region</Label>
            <Input
              value={newCommRegion}
              onChange={e => setNewCommRegion(e.target.value)}
              placeholder="e.g. Western districts"
              className={Surface[50]}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewCommunityOpen(false)}>
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
