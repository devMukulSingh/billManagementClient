import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '~/components/ui/form';
import { TForm } from '../CreateBillForm';
import { Input } from '~/components/ui/input';

export default function ProductRate({ form, index }: TForm) {
  return (
    <FormField
      disabled
      name={`bill_items.${index}.product.rate`}
      control={form.control}
      render={({ field }) => (
        <FormItem className="w-20">
          <FormLabel>Rate ₹</FormLabel>
          <FormControl>
            <Input className="bg-white" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
