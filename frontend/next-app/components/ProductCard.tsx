import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Button } from './Button';

type Product = {
  id: string;
  name: string;
  image: string;
  priceNow: number;
  priceOld?: number;
  weight?: string;
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { id, name, image, priceNow, priceOld, weight } = product;
  return (
    <div className={styles.card} aria-label={`Product ${name}`}>
      <Image src={image} alt={name} width={300} height={300} className={styles.image} />
      <h3 className={styles.title}>{name}</h3>
      {weight && <p className={styles.weight}>{weight}</p>}
      <div className={styles.price}>
        <span className={styles.now}>${priceNow.toFixed(2)}</span>
        {priceOld && <span className={styles.old}>${priceOld.toFixed(2)}</span>}
      </div>
      <Button variant="primary" onClick={() => console.log(`Add ${id} to cart`)}>
        Add to Cart
      </Button>
    </div>
  );
};
