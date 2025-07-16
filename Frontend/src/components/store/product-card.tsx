import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoinBadge } from "@/components/ui/coin-badge";
import { Product } from "@/types";
import { ShoppingCart, Package, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onPurchase?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  canPurchase?: boolean;
  isTeacher?: boolean;
  isLoading?: boolean;
}

export function ProductCard({
  product,
  onPurchase,
  onDelete,
  canPurchase = false,
  isTeacher = false,
  isLoading = false,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-lg leading-tight">{product.name}</span>
          </div>
          <CoinBadge amount={product.price} size="sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <Badge
            variant={isOutOfStock ? "destructive" : "secondary"}
            className="text-xs"
          >
            Stock: {product.stock}
          </Badge>
        </div>

        <div className="flex gap-2">
          {!isTeacher && onPurchase && (
            <Button
              size="sm"
              onClick={() => {
                console.log("Click en comprar:", {
                  productId: product._id,
                  canPurchase,
                  isOutOfStock,
                  isLoading,
                  onPurchaseExists: !!onPurchase,
                });
                onPurchase?.(product._id);
              }}
              disabled={!canPurchase || isOutOfStock || isLoading}
              className="flex items-center gap-2 flex-1"
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? "Sin Stock" : "Comprar"}
            </Button>
          )}

          {isTeacher && onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(product._id)}
              disabled={isLoading}
              className="flex items-center gap-2 flex-1"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
