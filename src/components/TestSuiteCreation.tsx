
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileText, ArrowRight } from "lucide-react";

interface TestSuite {
  id: string;
  name: string;
  type: 'Excel' | 'Custom';
  confidentialityStatus: boolean;
}

interface TestSuiteCreationProps {
  testSuites: TestSuite[];
  setTestSuites: (suites: TestSuite[]) => void;
  onNext: () => void;
  onBack: () => void;
  setSelectedTestSuiteId: (id: string) => void;
}

const TestSuiteCreation = ({ testSuites, setTestSuites, onNext, onBack, setSelectedTestSuiteId }: TestSuiteCreationProps) => {
  const [newSuite, setNewSuite] = useState({ 
    name: '', 
    type: 'Excel' as 'Excel' | 'Custom',
    confidentialityStatus: false
  });
  const [errors, setErrors] = useState({ name: '' });

  const addTestSuite = async () => {
    if (!newSuite.name.trim()) {
      setErrors({ name: 'Test suite name is required' });
      return;
    }
  
    const payload = {
      suite_name: newSuite.name,
      suite_type: newSuite.type.toLowerCase(), // 'excel' or 'custom'
      confidential_status: newSuite.confidentialityStatus,
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/user/1/test-suite/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create test suite");
      }
  
      const data = await response.json();
  
      const testSuite: TestSuite = {
        id: data.id || Date.now().toString(), // Use backend ID if available
        name: newSuite.name,
        type: newSuite.type,
        confidentialityStatus: newSuite.confidentialityStatus,
      };
  
      setTestSuites([...testSuites, testSuite]);
      setSelectedTestSuiteId(testSuite.id);
      setNewSuite({ name: '', type: 'Excel', confidentialityStatus: false });
      setErrors({ name: '' });
    } catch (error) {
      console.error("Error creating test suite:", error);
      alert("Failed to create test suite. Please try again.");
    }
  };
  

  const removeTestSuite = (id: string) => {
    setTestSuites(testSuites.filter(suite => suite.id !== id));
  };

  const canProceed = testSuites.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Test Suites
          </CardTitle>
          <CardDescription>
            Create multiple test suites for comprehensive AI evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Test Suite */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suiteName">Test Suite Name</Label>
              <Input
                id="suiteName"
                placeholder="e.g., Conversational AI Test"
                value={newSuite.name}
                onChange={(e) => setNewSuite({ ...newSuite, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Input Format</Label>
              <Select
                value={newSuite.type}
                onValueChange={(value: 'Excel' | 'Custom') => setNewSuite({ ...newSuite, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Confidentiality Status</Label>
              <Select
                value={newSuite.confidentialityStatus.toString()}
                onValueChange={(value) => setNewSuite({ ...newSuite, confidentialityStatus: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">False</SelectItem>
                  <SelectItem value="true">True</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
  onClick={addTestSuite} 
  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
>
  <Plus className="w-4 h-4 mr-2" />
  Add Test Suite
</Button>


          {/* Existing Test Suites */}
          {testSuites.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Created Test Suites</h3>
              <div className="grid gap-3">
                {testSuites.map((suite) => (
                  <div key={suite.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium text-black dark:text-black">{suite.name}</h4>
                      <p className="text-sm text-gray-600">
                        Format: {suite.type} | Confidential: {suite.confidentialityStatus ? 'True' : 'False'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestSuite(suite.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Configuration <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestSuiteCreation;
