import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductComparison = () => {
  const comparisonData = {
    currentProduct: {
      id: 1,
      name: "Organic Whole Grain Cereal",
      brand: "Nature\'s Best",
      score: 72,
      grade: "B",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
      price: "$4.99",
      keyFeatures: ["High Fiber", "Whole Grains", "Fortified"]
    },
    alternatives: [
      {
        id: 2,
        name: "Steel Cut Oats Original",
        brand: "Healthy Choice",
        score: 89,
        grade: "A",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop",
        price: "$3.49",
        keyFeatures: ["No Added Sugar", "100% Whole Grain", "High Protein"],
        improvement: "+17 points",
        reasons: ["No added sugars", "Lower sodium", "Higher protein content"]
      },
      {
        id: 3,
        name: "Ancient Grains Blend",
        brand: "Pure Harvest",
        score: 81,
        grade: "A",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
        price: "$5.99",
        keyFeatures: ["Quinoa & Amaranth", "Organic", "Gluten-Free"],
        improvement: "+9 points",
        reasons: ["Ancient grain blend", "Organic certification", "Higher mineral content"]
      },
      {
        id: 4,
        name: "Protein Power Cereal",
        brand: "FitLife",
        score: 76,
        grade: "B",
        image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=300&h=300&fit=crop",
        price: "$6.49",
        keyFeatures: ["15g Protein", "Low Sugar", "Added Probiotics"],
        improvement: "+4 points",
        reasons: ["Higher protein", "Added probiotics", "Lower sugar content"]
      }
    ]
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-success text-success-foreground';
      case 'B': return 'bg-warning text-warning-foreground';
      case 'C': return 'bg-amber-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Product */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Current Product
        </h3>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={comparisonData?.currentProduct?.image} 
                alt={comparisonData?.currentProduct?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary">{comparisonData?.currentProduct?.name}</h4>
              <p className="text-sm text-text-secondary">{comparisonData?.currentProduct?.brand}</p>
              <div className="flex items-center space-x-2 mt-1">
                {comparisonData?.currentProduct?.keyFeatures?.map((feature, index) => (
                  <span key={index} className="text-xs bg-muted text-text-secondary px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(comparisonData?.currentProduct?.score)}`}>
                {comparisonData?.currentProduct?.score}
              </div>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getGradeColor(comparisonData?.currentProduct?.grade)} text-sm font-bold`}>
                {comparisonData?.currentProduct?.grade}
              </div>
              <div className="text-sm text-text-secondary mt-1">{comparisonData?.currentProduct?.price}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Better Alternatives */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Better Alternatives
        </h3>
        <div className="space-y-4">
          {comparisonData?.alternatives?.map((product) => (
            <div key={product?.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-card transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={product?.image} 
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-text-primary">{product?.name}</h4>
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded font-medium">
                      {product?.improvement}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{product?.brand}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    {product?.keyFeatures?.map((feature, index) => (
                      <span key={index} className="text-xs bg-muted text-text-secondary px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-text-primary">Why it's better:</p>
                    <ul className="space-y-1">
                      {product?.reasons?.map((reason, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Icon name="CheckCircle" size={14} className="text-success flex-shrink-0" />
                          <span className="text-sm text-text-secondary">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(product?.score)}`}>
                    {product?.score}
                  </div>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getGradeColor(product?.grade)} text-sm font-bold`}>
                    {product?.grade}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">{product?.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Comparison Summary */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="font-medium text-text-primary">Improvement Opportunities</h3>
        </div>
        <p className="text-sm text-text-secondary mb-3">
          Based on your current selection, switching to any of the alternatives above could improve your nutritional intake by reducing added sugars, increasing fiber content, and providing better overall nutritional value.
        </p>
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm text-text-secondary">
            Prices and availability may vary by location and retailer.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;