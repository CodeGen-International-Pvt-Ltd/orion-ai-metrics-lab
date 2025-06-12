
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface TestSuite {
  id: number;
  user_id: number;
  name: string;
  type: 'excel' | 'custom' | string;
  created_at: string;
  confidentialityStatus: boolean;
}

interface DeleteTestSuiteProps {
  testSuite: TestSuite;
  userId: number; // <-- Add this
  onDeleteTestSuite: (suiteId: number) => void;
}

const DeleteTestSuite = ({ testSuite, userId, onDeleteTestSuite }: DeleteTestSuiteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/user/${userId}/test-suite/${testSuite.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Failed to delete:", error);
        alert('Failed to delete test suite. Please try again.');
        return;
      }

      console.log("Test suite deleted:", testSuite.id);
      onDeleteTestSuite(testSuite.id);
    } catch (err) {
      console.error("Delete error:", err);
      alert('Failed to delete test suite. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-3 h-3" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the test suite "{testSuite.name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTestSuite;
