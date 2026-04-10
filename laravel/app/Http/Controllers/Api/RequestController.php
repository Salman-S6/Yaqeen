<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Request\AssignRequestRequest;
use App\Http\Requests\Request\StoreRequestRequest;
use App\Http\Resources\RequestResource;
use App\Services\RequestService;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    protected $service;

    public function __construct(RequestService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return RequestResource::collection(
            $this->service->getAll()
        );
    }

    public function store(StoreRequestRequest $request)
    {
        $result = $this->service->create(
            $request->validated(),
            Auth::user()
        );

        return new RequestResource($result);
    }

    public function show($id)
    {
        return new RequestResource(
            $this->service->findById($id)
        );
    }

    public function assign($id, AssignRequestRequest $request)
    {
        $result = $this->service->assign($id, $request->employee_id);

        return new RequestResource($result);
    }
}
