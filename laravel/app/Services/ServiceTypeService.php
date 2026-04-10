<?php

namespace App\Services;

use App\Models\ServiceType;

class ServiceTypeService
{
    public function all()
    {
        return ServiceType::all();
    }

    public function find($id)
    {
        return ServiceType::findOrFail($id);
    }

    public function create(array $data)
    {
        return ServiceType::create($data);
    }

    public function update(ServiceType $serviceType, array $data)
    {
        $serviceType->update($data);

        return $serviceType;
    }

    public function delete(ServiceType $serviceType)
    {
        return $serviceType->delete();
    }
}
