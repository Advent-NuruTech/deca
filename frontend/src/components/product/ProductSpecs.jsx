// src/components/product/ProductSpecs.jsx
const ProductSpecs = ({ specifications, brand, model }) => {
  const hasSpecs = specifications && Object.keys(specifications).length > 0;
  if (!hasSpecs && !brand && !model) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brand && (
          <div className="flex border-b border-gray-100 py-2">
            <span className="w-32 text-gray-500">Brand</span>
            <span className="text-gray-800">{brand}</span>
          </div>
        )}
        {model && (
          <div className="flex border-b border-gray-100 py-2">
            <span className="w-32 text-gray-500">Model/Variety</span>
            <span className="text-gray-800">{model}</span>
          </div>
        )}
        {hasSpecs &&
          Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex border-b border-gray-100 py-2">
              <span className="w-32 text-gray-500 capitalize">{key}</span>
              <span className="text-gray-800">{value}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductSpecs;
