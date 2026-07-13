import { useApp } from '../../store/AppContext';
import { Surface, Primary } from '../../theme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PaymentModal() {
  const { isPaymentPopupOpen, setIsPaymentPopupOpen, handlePaymentSuccess } = useApp();

  return (
    <Dialog open={isPaymentPopupOpen} onOpenChange={setIsPaymentPopupOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select a subscription plan to complete your registration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <button
            onClick={handlePaymentSuccess}
            className={`w-full text-left p-3 border ${Surface.border[200]} rounded-xl font-bold text-sm ${Primary.hover.border[500]} ${Primary.hoverOpacity.bg_50_50} transition`}
          >
            Gold Plan — ₹999
          </button>
          <button
            onClick={handlePaymentSuccess}
            className={`w-full text-left p-3 border ${Surface.border[200]} rounded-xl font-bold text-sm ${Primary.hover.border[500]} ${Primary.hoverOpacity.bg_50_50} transition`}
          >
            Premium Plan — ₹1499
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPaymentPopupOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
