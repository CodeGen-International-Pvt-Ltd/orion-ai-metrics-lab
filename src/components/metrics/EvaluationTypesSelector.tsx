
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EvaluationTypesSelectorProps {
  config: any;
  setConfig: (config: any) => void;
}

const EvaluationTypesSelector = ({ config, setConfig }: EvaluationTypesSelectorProps) => {
  const evaluationTypes = [
    'Summarization',
    'Retrieval of identical or similar content',
    'Retrieval across multiple templates/formats',
    'Retrieval across time series',
    'Graph generation',
    'Arithmetic accuracy',
    'Logical reasoning',
    'Counterfactual reasoning',
    'Inference tasks',
    'Interactive question/answering'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Evaluation Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {evaluationTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              checked={config.evaluationTypes?.[type] || false}
              onCheckedChange={(checked) => setConfig({
                ...config,
                evaluationTypes: { ...config.evaluationTypes, [type]: checked }
              })}
            />
            <Label className="text-sm">{type}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationTypesSelector;
