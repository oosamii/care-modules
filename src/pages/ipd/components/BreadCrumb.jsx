import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <div className="py-3 flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {isLast ? (
              <span className="text-gray-900 font-medium">{item.name}</span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-gray-700 font-normal"
              >
                {item.name}
              </Link>
            )}

            {!isLast && <span className="text-gray-400 text-xs">›</span>}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
