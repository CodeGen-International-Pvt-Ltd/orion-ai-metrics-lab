
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Download, CheckCircle, Mail, Share } from "lucide-react";

interface ReportGenerationProps {
  results: any;
  onBack: () => void;
}

const ReportGeneration = ({ results, onBack }: ReportGenerationProps) => {
  const [reportOptions, setReportOptions] = useState({
    executiveSummary: true,
    detailedMetrics: true,
    visualCharts: true,
    recommendations: true,
    rawData: false,
    technicalDetails: false
  });
  const [reportFormat, setReportFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 3000);
  };

  const downloadReport = () => {
    // Simulate file download
    const element = document.createElement('a');
    const file = new Blob(['OrionAI Evaluation Report - Generated'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `OrionAI_Evaluation_Report_${new Date().toISOString().split('T')[0]}.${reportFormat.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Evaluation Report
          </CardTitle>
          <CardDescription>
            Create a comprehensive report of your OrionAI evaluation results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!reportGenerated ? (
            <>
              {/* Report Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Report Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries({
                    executiveSummary: 'Executive Summary',
                    detailedMetrics: 'Detailed Metrics Analysis',
                    visualCharts: 'Visual Charts & Graphs',
                    recommendations: 'Improvement Recommendations',
                    rawData: 'Raw Test Data',
                    technicalDetails: 'Technical Implementation Details'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        checked={reportOptions[key as keyof typeof reportOptions]}
                        onCheckedChange={(checked) => 
                          setReportOptions({ ...reportOptions, [key]: checked })
                        }
                      />
                      <Label className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Report Format</h3>
                <div className="flex gap-4">
                  {['PDF', 'Excel', 'Word'].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={format}
                        name="format"
                        value={format}
                        checked={reportFormat === format}
                        onChange={(e) => setReportFormat(e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={format}>{format}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Preview */}
              <div className="bg-white text-black rounded-lg p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/30 dark:text-black">
              <h4 className="font-semibold mb-3 dark:text-white">Report Preview</h4>
  <div className="space-y-2 text-sm dark:text-white">
    <div className="flex justify-between dark:text-white">
      <span>Overall Score:</span>
      <span className="font-medium dark:text-white">{results?.overall_score}%</span>
    </div>
    <div className="flex justify-between">
      <span>Test Date:</span>
      <span>{new Date().toLocaleDateString()}</span>
    </div>
    <div className="flex justify-between">
      <span>Total Tests:</span>
      <span>{results?.detailed_results?.total_tests}</span>
    </div>
    <div className="flex justify-between">
      <span>Format:</span>
      <span>{reportFormat}</span>
    </div>
  </div>
</div>


              {/* Generate Button */}
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </>
          ) : (
            /* Report Generated */
            <div className="text-center space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Report Generated Successfully!
                </h3>
                <p className="text-green-700">
                  Your comprehensive OrionAI evaluation report is ready for download.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Download Report</h4>
                    <Button onClick={downloadReport} className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Download {reportFormat}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Share className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Share Report</h4>
                    <Button variant="outline" className="w-full">
                      Get Share Link
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Review the detailed recommendations in your report</li>
                  <li>• Share results with your development team</li>
                  <li>• Plan implementation of suggested improvements</li>
                  <li>• Schedule follow-up evaluations to track progress</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Results
        </Button>
        {reportGenerated && (
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            Start New Evaluation
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportGeneration;
