
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"

interface HelpDialogProps {
  children: React.ReactNode;
}

const HelpDialog = ({ children }: HelpDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
          <DialogDescription>
            Get help with using the AI Evaluator Platform.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Getting Started</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Create a test suite with your evaluation criteria</li>
                <li>• Configure metrics and thresholds</li>
                <li>• Select an AI model to evaluate</li>
                <li>• Execute tests and review results</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Common Issues</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Test execution failing: Check your API credentials</li>
                <li>• Slow performance: Reduce batch size in settings</li>
                <li>• Invalid results: Verify test suite configuration</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Contact Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For additional help, contact our support team at{" "}
                <span className="text-blue-600 dark:text-blue-400">support@aievaluator.com</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
