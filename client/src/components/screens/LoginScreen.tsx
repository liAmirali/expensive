const LoginScreen = () => {
  return (
    <div>
      <div className="max-w-[80%] mx-auto rounded-lg bg-oxfordblue-500 p-4 shadow-xl space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-timberwolf-500"
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder="jondoe@example.com"
            className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-timberwolf-500"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="•••••••••"
            className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div>
          <input
            id="password"
            type="submit"
            placeholder="•••••••••"
            className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
