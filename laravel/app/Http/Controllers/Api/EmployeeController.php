<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
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
        return response()->json([
            'message' => 'Employee created successfully',
            'data' => $this->service->create($request->validated()),
        ]);
    }

    public function index()
    {
        return $this->service->all();
    }

    public function show($id)
    {
        return $this->service->find($id);
    }

    public function destroy($id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Employee deleted successfully',
        ]);
    }
}
