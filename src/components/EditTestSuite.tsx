
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";

interface TestSuite {
  id: number;
  user_id: number;
  name: string;
  type: 'excel' | 'custom' | string;
  created_at: string;
  confidentialityStatus: boolean;
}

interface EditTestSuiteProps {
  testSuite: TestSuite;
  userId: number; // <-- Add this
  onUpdateTestSuite: (testSuite: TestSuite) => void;
}

const EditTestSuite = ({ testSuite, userId, onUpdateTestSuite }: EditTestSuiteProps) => {
  const [suiteName, setSuiteName] = useState(testSuite.name);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!suiteName.trim()) {
      setError('Test suite name is required');
      return;
    }
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/user/${userId}/test-suite/${testSuite.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suite_name: suiteName.trim(),
          user: testSuite.user_id,
          confidential_status: testSuite.confidentialityStatus,
        }),
      });
  
      if (!res.ok) {
        const error = await res.text();
        console.error("Failed to update:", error);
        return;
      }
  
      const data = await res.json();
      console.log("Test suite updated:", data);
      onUpdateTestSuite({
        ...testSuite,
        name: suiteName.trim(),
      });
      setIsOpen(false);
      setError('');
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  

    

  const handleCancel = () => {
    setSuiteName(testSuite.name);
    setError('');
    setIsOpen(false);
  };

  
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
  <Button
    variant="outline"
    size="sm"
    className="gap-2"
    onClick={() => {
      console.log("Edit clicked for Test Suite ID:", testSuite.id);
      console.log("User ID:", testSuite.user_id);
      setIsOpen(true); // manually open the dialog since you're using onClick
    }}
  >
    <Edit2 className="w-3 h-3" />
    Edit
  </Button>
</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Test Suite</DialogTitle>
          <DialogDescription>
            Update the name of your test suite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-suite-name">Test Suite Name</Label>
            <Input
              id="edit-suite-name"
              type="text"
              placeholder="Enter test suite name"
              value={suiteName}
              onChange={(e) => setSuiteName(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTestSuite;
