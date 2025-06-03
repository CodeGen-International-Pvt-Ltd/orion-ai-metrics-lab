
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface TestExecutionProps {
  onNext: () => void;
  onBack: () => void;
  setResults: (results: any) => void;
  selectedTestSuiteId?: string | null;
}

const TestExecution = ({ onNext, onBack, setResults, selectedTestSuiteId }: TestExecutionProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [completedTests, setCompletedTests] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const testPhases = [
    { name: 'Initializing Test Environment', duration: 1000 },
    { name: 'Loading Test Suites', duration: 1500 },
    { name: 'Running Correctness Tests', duration: 3000 },
    { name: 'Evaluating Answer Relevancy', duration: 2500 },
    { name: 'Checking for Hallucinations', duration: 2000 },
    { name: 'Analyzing Contextual Relevance', duration: 2000 },
    { name: 'Running Statistical Analysis', duration: 1500 },
    { name: 'Generating Evaluation Scores', duration: 1000 },
    { name: 'Finalizing Results', duration: 500 }
  ];

  // Generate unique results based on test suite ID
  const generateMockResults = (suiteId: string) => {
    const seed = suiteId ? parseInt(suiteId.slice(-3)) || 123 : 123;
    const random = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
    
    const correctnessScore = 85 + random(0, 15);
    const hallucinationScore = random(1, 8);
    const relevancyScore = 88 + random(0, 12);
    const contextualScore = 82 + random(0, 18);
    
    const overallScore = (correctnessScore + (100 - hallucinationScore) + relevancyScore + contextualScore) / 4;
    
    const totalTests = Math.floor(120 + random(0, 80));
    const passRate = 0.85 + random(0, 0.15);
    const passed = Math.floor(totalTests * passRate);
    const failed = Math.floor(totalTests * (1 - passRate) * 0.7);
    const warnings = totalTests - passed - failed;

    return {
      overall_score: Math.round(overallScore * 10) / 10,
      metrics: {
        correctness: { 
          score: Math.round(correctnessScore * 10) / 10, 
          threshold: 95, 
          status: correctnessScore >= 95 ? 'passed' : 'warning' 
        },
        hallucination: { 
          score: Math.round(hallucinationScore * 10) / 10, 
          threshold: 5, 
          status: hallucinationScore <= 5 ? 'passed' : 'warning' 
        },
        answer_relevancy: { 
          score: Math.round(relevancyScore * 10) / 10, 
          threshold: 95, 
          status: relevancyScore >= 95 ? 'passed' : 'warning' 
        },
        contextual_relevance: { 
          score: Math.round(contextualScore * 10) / 10, 
          threshold: 95, 
          status: contextualScore >= 95 ? 'passed' : 'warning' 
        }
      },
      detailed_results: {
        total_tests: totalTests,
        passed: passed,
        warnings: warnings,
        failed: failed
      },
      execution_time: `${Math.floor(3 + random(0, 4))}m ${Math.floor(10 + random(0, 50))}s`,
      timestamp: new Date().toISOString()
    };
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      const totalDuration = testPhases.reduce((sum, phase) => sum + phase.duration, 0);
      let currentTime = 0;

      const interval = setInterval(() => {
        currentTime += 100;
        const newProgress = Math.min((currentTime / totalDuration) * 100, 100);
        setProgress(newProgress);

        // Update current phase
        let cumulativeTime = 0;
        for (let i = 0; i < testPhases.length; i++) {
          cumulativeTime += testPhases[i].duration;
          if (currentTime <= cumulativeTime) {
            setCurrentPhase(testPhases[i].name);
            break;
          }
        }

        // Mark phases as completed
        const completed = [];
        let timeSum = 0;
        for (let i = 0; i < testPhases.length; i++) {
          timeSum += testPhases[i].duration;
          if (currentTime > timeSum) {
            completed.push(testPhases[i].name);
          }
        }
        setCompletedTests(completed);

        if (newProgress >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          const results = generateMockResults(selectedTestSuiteId || '');
          setResults(results);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, setResults, selectedTestSuiteId]);

  const startTest = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTest = () => {
    setIsPaused(true);
  };

  const resumeTest = () => {
    setIsPaused(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Test Execution
            {selectedTestSuiteId && (
              <span className="text-sm font-normal text-gray-600">
                (Suite ID: {selectedTestSuiteId})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Execute evaluation tests for OrionAI performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isRunning ? (
              <Button onClick={startTest} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start Test Execution
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button onClick={resumeTest} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={pauseTest} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Progress Section */}
          {isRunning && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Execution Progress</h3>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">Current Phase:</p>
                <p className="text-blue-700">{currentPhase}</p>
              </div>
            </div>
          )}

          {/* Test Phases Status */}
          {isRunning && (
            <div className="space-y-3">
              <h4 className="font-semibold">Test Phases</h4>
              <div className="space-y-2">
                {testPhases.map((phase) => (
                  <div key={phase.name} className="flex items-center gap-3 p-2 rounded border">
                    {completedTests.includes(phase.name) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : currentPhase === phase.name ? (
                      <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={
                      completedTests.includes(phase.name) ? 'text-green-700 font-medium' :
                      currentPhase === phase.name ? 'text-blue-700 font-medium' :
                      'text-gray-600'
                    }>
                      {phase.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">Test Execution Complete!</h3>
              <p className="text-green-700">
                All evaluation tests have been completed successfully. View detailed results in the next step.
              </p>
            </div>
          )}

          {/* Warning Messages */}
          {!isRunning && !isComplete && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Before Starting</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Ensure OrionAI system is accessible and running</li>
                    <li>• Test execution may take several minutes to complete</li>
                    <li>• Do not close this window during test execution</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isRunning && !isPaused}>
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isComplete}
          className="bg-blue-600 hover:bg-blue-700"
        >
          View Results <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestExecution;
