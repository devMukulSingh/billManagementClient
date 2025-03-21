import React, { Dispatch, SetStateAction } from 'react';
import DialogModal from '../modals/DialogModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { billSchema } from 'lib/schema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL_SERVER } from 'lib/constants';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/remix';
import { TDistributor, TDomain } from 'lib/types/db.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { TApiResponse } from 'lib/types/apiResponse.types';
import DistributorName from '../formFields/DistributorName';
import Domain from '../formFields/Domain';
type Props = {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  distributor: TDistributor;
};

const schema = billSchema.pick({ distributor_name: true, domain_id: true });

type TformValues = z.infer<typeof schema>;

export default function EditdistributorDialog({
  openDialog,
  setOpenDialog,
  distributor,
}: Props) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const { mutate, isPending } = useMutation<any, any, TformValues>({
    mutationKey: ['update_distributor'],
    mutationFn: async (data) => {
      return await axios.put(
        `${BASE_URL_SERVER}/${userId}/distributor/${distributor.id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_distributors'] });
      queryClient.invalidateQueries({ queryKey: ['get_all_distributors'] });
      setOpenDialog(false);
      toast.success(`Distributor Updated`, { position: 'bottom-right' });
    },
  });
  const form = useForm<TformValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      distributor_name: distributor.name,
      domain_id: distributor.domain.id,
    },
  });
  function onSubmit(e: any) {
    e.stopPropagation();
    const formData = form.getValues();
    mutate(formData);
  }
  return (
    <DialogModal
      title="Edit distributor"
      open={openDialog}
      titleIcon={PlusCircle}
      onClose={() => setOpenDialog(false)}
    >
      <form className="space-y-10">
        <Form {...form}>
          <DistributorName form={form} isPending={isPending} />
          <Domain form={form} isPending={isPending} />
        </Form>
        <Button disabled={isPending} type="button" onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </DialogModal>
  );
}
