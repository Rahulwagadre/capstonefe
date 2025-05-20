const addresss = [
    {
        id: 1,
        name: "Rahul wagadre",
        email: "rahul@gmail.com",
        contact: "6266965511",
        street: "rahul residency behind tamanna building sakare vasti Hinjewadi",
        city: "Pune",
        state: "MH",
        postalCode: "460551",
        country: "IND",
    },
    {
        id: 2,
        name: "Rajat Upadhyay",
        email: "rajat@gmail.com",
        contact: "6266965511",
        street: "7th cross",
        city: "Varanasi",
        state: "UP",
        postalCode: "460551",
        country: "IND",
    },
    {
        id: 3,
        name: "Deepak Prajapati",
        email: "rahul@gmail.com",
        contact: "6266965511",
        street: "7th cross",
        city: "Banglore",
        state: "BLR",
        postalCode: "460551",
        country: "IND",
    },
  ]
  
  export function AddressList() {
    return (
      <ul className="divide-y divide-gray-100">
        {addresss.map((address) => (
          <li key={address.id} className="flex items-center gap-x-4 py-5">
            {/* Radio Button */}
            <input
              defaultChecked
              id={address.email}
              name="address"
              type="radio"
              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
            {/* Address Details */}
            <div className="flex flex-1 justify-between gap-x-6">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold text-gray-900">{address.name}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">{address.email}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {address.street}, {address.city}, {address.state}, {address.postalCode}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm text-gray-900">{address.contact}</p>
                <p className="mt-1 text-xs text-gray-500">{address.city}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  