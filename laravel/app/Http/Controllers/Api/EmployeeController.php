<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\EmployeeService;

class EmployeeController extends Controller
{
    protected $service;

    public function __construct(EmployeeService $service)
    {
        $this->service = $service;
    }

    public function store(StoreEmployeeRequest $request)
    {
        $employee = $this->service->create($request->validated());

        return new EmployeeResource($employee);
    }

    public function update(UpdateEmployeeRequest $request, int $id)
    {
        $employee = $this->service->find($id);

        $updatedEmployee = $this->service->update($employee, $request->validated());

        return new EmployeeResource($updatedEmployee);
    }

    public function index()
    {
        // return $this->service->all();
        return EmployeeResource::collection($this->service->all());

    }

    public function show($id)
    {
        // return $this->service->find($id);
        return new EmployeeResource($this->service->find($id));

    }

    public function destroy($id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Employee deleted successfully',
        ]);
    }
}
